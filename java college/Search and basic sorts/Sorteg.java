public class Sorteg {
    public static void main(String[] args) {
        int[] arr1={3,2,10,6,1};
         for(int i=0;i<arr1.length;i++){ 
            for(int j=i+1;j<arr1.length;j++){   
            if(arr1[i]>arr1[j]){
               arr1[i]=j ;     
            } }
            System.out.println(arr1[i]+" ");
            break;
            }
        }

    }
    


