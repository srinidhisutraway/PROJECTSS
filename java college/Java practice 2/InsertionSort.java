import java.util.Arrays;
public class InsertionSort {
    public static void main(String[] args) {
        int[] arr={2,6,3,1,5};
        for(int i=arr.length-1;i>=0;i--){
            for(int j=i-1;j>=0;j--){
                if(arr[i]<arr[j]){
                    int temp=arr[i];
                    arr[i]=arr[j];
                    arr[j]=temp;
                }
                else break;
            }

        }
         System.out.println(Arrays.toString(arr));
        
    }
    
}
