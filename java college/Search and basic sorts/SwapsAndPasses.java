import java.util.*;
public class SwapsAndPasses {
    public static void main(String[] args) {
    int[] arr={4,2,5,6,1,9};
    int count=0,pass=0;
    for(int i=0;i<arr.length-1;i++){
        pass++;
        for(int j=0;j<arr.length-1;j++){
            if(arr[j]>arr[j+1]){
                int temp=arr[j];
                arr[j]=arr[j+1];
                arr[j+1]=temp;
                count++;
            }
        }      
    
    }        System.out.print(Arrays.toString(arr));

            System.out.println("count="+count+"& Passes="+pass);

    
}}
